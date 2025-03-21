import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './schema/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);
    return task.save();
  }


  async getAllTasks(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{ tasks: Task[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
  
    if (status) {
      filter.status = status;
    }
  
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },     
        { description: { $regex: search, $options: 'i' } } 
      ];
    }
    const tasks = await this.taskModel.find(filter).skip(skip).limit(limit).exec();
    const total = await this.taskModel.countDocuments(filter);
  
    return {
      tasks,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
  

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }



  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
      runValidators: true, 
    });

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    const result = await this.taskModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }
}