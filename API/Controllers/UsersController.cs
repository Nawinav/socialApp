using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
     [Authorize]
    public class UsersController:BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;


        }

      
        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDTO>>> GetUsers([FromQuery]UserParams userParams){
            
            var currentUser=await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername=currentUser.UserName;

            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender=currentUser.Gender=="male"?"female":"male";
            }
            
            var users=await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,users.PageSize,
            users.TotalCount,users.TotalPages));

            return Ok(users);
        }
      
        // [HttpGet("{id}")]
        // public async Task<ActionResult<MemberDTO>> GetUser(string username){
        //     var user= await _userRepository.GetUserByUsernameAsync(username);

        //     var userToReturn = _mapper.Map<MemberDTO>(user);

        //     return Ok(userToReturn);
        // }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
           

            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user==null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error !=null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count==0) photo.IsMain = true;

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync()) {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Photo not being added");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if(user==null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if(photo==null) return NotFound();

            if(photo.IsMain) return BadRequest("this is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if(currentMain!=null) currentMain.IsMain = false;

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting the main photo");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if(user==null) return NotFound();

            _mapper.Map(memberUpdateDto, user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");

        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            var user=await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo=user.Photos.FirstOrDefault(x=>x.Id==photoId);

            if(photo==null) return NotFound();
            if(photo.IsMain) return BadRequest("You cannot delete your main photo");

            if(photo.PublicId !=null){
                var result=await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error !=null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting photo");
        }
    }
}