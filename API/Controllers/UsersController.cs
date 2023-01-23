using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
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
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository,IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;

        }

      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers(){
            var user=await _userRepository.GetMembersAsync();



            return Ok(user);
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
    }
}