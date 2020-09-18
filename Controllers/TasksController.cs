using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using APPKA.Data;
using APPKA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace APPKA.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TasksController : ControllerBase
    {

        private readonly ILogger<TasksController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public TasksController(ILogger<TasksController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public IEnumerable<Task> Get()
        {
            var loggedUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tasks = _context.Tasks.Where(x => x.userID == loggedUserId);
            return tasks;

        }
        [HttpPost]
        public int CreateTask([FromBody]object task)
        {
            var taskToBeCreated = JObject.Parse(task.ToString()).ToObject<Task>();
            taskToBeCreated.taskDate = taskToBeCreated.taskDate.ToLocalTime();
            taskToBeCreated.userID = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _context.Tasks.Add(taskToBeCreated);
            _context.SaveChanges();

            int createdTaskId = taskToBeCreated.taskID;
            return createdTaskId;
        }
        [HttpPut]
        public object UpdateTaskStatus([FromBody]object task)
        {
            var taskToBeUpdated = JObject.Parse(task.ToString()).ToObject<Task>();

            _context.Tasks.Find(taskToBeUpdated.taskID).taskStatus = taskToBeUpdated.taskStatus;
            _context.SaveChanges();

            return taskToBeUpdated;
        }
        [HttpDelete]
        public object DeleteTask([FromBody]object task)
        {
            var taskToBeDeleted = JObject.Parse(task.ToString()).ToObject<Task>();
            _context.Tasks.Remove(_context.Tasks.Find(taskToBeDeleted.taskID));
            _context.SaveChanges();

            return taskToBeDeleted;
        }
    }
}
