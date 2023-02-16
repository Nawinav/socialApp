import { AccountService } from './../../_services/account.service';
import { User } from './../../_model/User';
import { environment } from './../../../environments/environment.prod';
import { Component, Input } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { take } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { MembersService } from 'src/app/_services/members.service';
import { Photo } from 'src/app/_model/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;

  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  public uploader: FileUploader | undefined;
  constructor(private accountService: AccountService,private memberService:MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }

  ngOnInit(): void {
  this.initializeUploader();
  }

  fileOverBase(e: any) {
    console.log(this.uploader?.queue?.length);

    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if(photo.isMain && this.user && this.member){
          this.user.photoUrl=photo.url;
          this.member.photoUrl=photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }

  setMainPhoto(photo:Photo){
      this.memberService.setMainPhoto(photo.id).subscribe({
          next:()=>{
            if(this.user && this.member){
              this.user.photoUrl=photo.url;
              this.accountService.setCurrentUser(this.user);
              this.member.photoUrl=photo.url;
              this.member.photos.forEach(p=>{
                if(p.isMain) p.isMain=false;
                if(p.id==photo.id) p.isMain=true;
              })
            }
          }
      })


  }

  deletePhoto(photoId:number){
      this.memberService.deletePhoto(photoId).subscribe({
        next:_=>{
          if(this.member){
            this.member.photos=this.member.photos.filter(x=>x.id !==photoId);
          }
        }
      })

  }
}
