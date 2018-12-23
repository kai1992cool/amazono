import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;

  newCategory = '';
  btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService) { }

  ngOnInit() {
    this.getCategories.bind(this)();
  }

  get token() {
    return localStorage.getItem('token');
  }

  async getCategories() {
    try {
      const data = await this.rest.get(
        '/api/categories'
      );
      data['success'] 
        ? (this.categories = data['categories'])
        : this.data.error(data['error']);
    } catch(error) {
      this.data.error(error['message']);
    }
  }
  async addCategory() {
    this.btnDisabled = true;
    if(!this.newCategory) {
      this.data.error('Category field cannot be blank');
    }
    try{
      const data = await this.rest.post(
        '/api/categories',
        {category: this.newCategory}
      );
      data['success'] 
      ? (this.getCategories.bind(this)(),this.data.success(data['message']))
      : this.data.error(data['message']);
    }catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
