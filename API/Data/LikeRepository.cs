using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikeRepository(DataContext context)
        {
            _context=context;
        }

        public async Task<UserLike> GetUserLike(int SourceUserId, int TargetUserId)
        {
            return await _context.Likes.FindAsync(SourceUserId,TargetUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesparams)
        {
            var users=_context.Users.OrderBy(u=>u.UserName).AsQueryable();
            var likes=_context.Likes.AsQueryable();

            if(likesparams.Predicate=="liked")
            {
                likes=likes.Where(like=>like.SourceUserId==likesparams.UserId);
                users=likes.Select(like=>like.TargetUser);

            }

            if(likesparams.Predicate=="likedBy")
            {
                likes=likes.Where(like=>like.TargetUserId==likesparams.UserId);
                users=likes.Select(like=>like.TargetUser);
                
            }

            var likedUsers=users.Select(user=>new LikeDto
            {
               UserName=user.UserName,
               KnownAs=user.KnownAs,
               Age=user.DateOfBirth.CalcuateAge(),
               PhotoUrl=user.Photos.FirstOrDefault(x=>x.IsMain).Url,
               City=user.City,
               Id=user.Id

            });

            return await PagedList<LikeDto>.CreatedAsync(likedUsers,likesparams.PageNumber,likesparams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
           return await _context.Users
                        .Include(x=>x.LikedUsers)
                        .FirstOrDefaultAsync(x=>x.Id==userId);
        }
    }
}