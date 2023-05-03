import { Component, OnInit } from '@angular/core';
import { BiblApiService } from '../../_service/bibl-api.service';
import { AuthService } from '../../_service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-biblio-item-category',
  templateUrl: './manage-biblio-item-category.component.html',
  styleUrls: ['./manage-biblio-item-category.component.scss']
})
export class ManageBiblioItemCategoryComponent implements OnInit {
  categories: any = [];
  errorMessage = '';
  formData: FormGroup;

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
  ) {
    this.formData = new FormGroup({
      cat_name: new FormControl('', Validators.required),
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  ngOnInit(): void {
    ////////////////
    this.getAllCategories();
  }

  getAllCategories() {
    this.apiService.getAllCategories().subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.categories = resp;
        }
        else {
          this.categories = [];
        }
      }
      else {
        this.categories = [];
      }
    })
  }

  onClickSubmit(data: any) {
    if (this.formData.valid) {
      this.apiService.addCategory(data.cat_name).subscribe(resp => {
        if (resp !== null) {
          if (resp.indexOf('Error:') > -1) {
            this.showToast(resp, 'bg-danger');
          }
          else {
            this.resetForm(this.formData);
            this.getAllCategories();
          }
        }
      })
    }
    else {
      this.showToast('Please fill all fields.', 'bg-danger');
    }
  }

  deleteCategory(cat: any) {
    if (confirm("Are you sure to delete " + cat.cat_name)) {
      this.apiService.deleteCategory(cat.id).subscribe(resp => {
        if (resp !== null) {
          if (resp.toLowerCase().indexOf('error') > -1) {
            this.showToast(resp, 'bg-danger');
          }
          else
            this.getAllCategories();
        }
      })
    }
  }

  showToast(msg: any, color: any) {
    document.getElementById('divCatError')?.classList.add('show')
    document.getElementById('divCatError')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divCatError')?.classList.remove('show')
      document.getElementById('divCatError')?.classList.add(color)
    }, 10000);
  }
}
