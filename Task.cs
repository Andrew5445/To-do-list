using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APPKA
{
    public class Task
    {
        [Key]
        public int taskID { get; set; }
        public string taskName { get; set; }

        public string taskPriority { get; set; }

        public bool taskStatus { get; set; }

        public DateTime taskDate { get; set; }

        public string userID { get; set; }
    }
}
