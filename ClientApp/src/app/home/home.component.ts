import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public tasks: Task[];
  public filteredTasksByDate: Task[];
  hideTaskId: boolean = true;
  taskNameEmpty: boolean = false;
  date = new FormControl(new Date());

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

    http.get<Task[]>(baseUrl + "tasks").subscribe(result => {
      this.tasks = result;
      this.filteredTasksByDate = this.performFilteringOnTasks();
    }, error => console.error(error));

  }

  changeDate(date: any) {
    //update view
    this.filteredTasksByDate = this.performFilteringOnTasks();
  }
  addTask(name, priority): void {

    //validate input
    if (name.length !== 0) {
      this.taskNameEmpty = false;
      const headers: HttpHeaders = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers.append('observe', 'response');
      let task: Task = {
        taskID: 0,
        taskName: name,
        taskPriority: priority,
        taskStatus: false,
        taskDate: this.date.value
      };
      this.http.post(this.baseUrl + "tasks", task, { headers: headers }).subscribe(result => {
        task.taskID = Number(result);
        this.tasks.push(task);
        this.filteredTasksByDate = this.performFilteringOnTasks();
        console.log("Task added." + JSON.stringify(result));
      },
        error => console.error(error));
    } else {
      this.taskNameEmpty = true;
    }
  }
  updateTaskStatus(checkBox, taskName, taskID) {

    let taskToBeUpdated = this.tasks.find(i => i.taskID === Number(taskID.innerHTML));
    taskToBeUpdated.taskStatus = checkBox.checked;
    this.filteredTasksByDate = this.performFilteringOnTasks();
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    this.http.put(this.baseUrl + "tasks", taskToBeUpdated, { headers: headers }).subscribe(result => { console.log("Task updated." + JSON.stringify(result)); }, error => console.error(error));
  }
  removeTask(taskName, taskID): void {

    let taskToBeDeleted = this.tasks.find(i => i.taskID === Number(taskID.innerHTML));
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    //remove task from array
    this.tasks.splice(this.tasks.indexOf(taskToBeDeleted), 1);
    this.filteredTasksByDate = this.performFilteringOnTasks();
    const options = {
      headers: headers,
      body: taskToBeDeleted,
    };
    this.http.delete(this.baseUrl + "tasks", options).subscribe(result => { console.log("Task removed." + JSON.stringify(result)); }, error => console.error(error));
  }
  validateTaskName(taskName): boolean {
    if (taskName.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  performFilteringOnTasks(): Task[] {

    let filteredTasks: Task[] = [];
    let dateToCompare = this.date.value;
    dateToCompare.setHours(0, 0, 0, 0);
    for (var task of this.tasks) {
      let taskDate = new Date(task.taskDate);
      if (taskDate.getTime() === dateToCompare.getTime()) {
        filteredTasks.push(task);
      }
    }
    return filteredTasks;
  }


}

interface Task {
  taskID: Number,
  taskName: string;
  taskPriority: string;
  taskStatus: boolean;
  taskDate: Date;

}
