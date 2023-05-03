import { Component, OnInit } from '@angular/core';
import { BiblApiService } from '../../_service/bibl-api.service';
import { AuthService } from '../../_service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent implements OnInit {
  roles: any = [];
  errorMessage = '';
  formData: FormGroup;

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
  ) {
    this.formData = new FormGroup({
      role_name: new FormControl('', Validators.required),
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  ngOnInit(): void {
    ////////////////
    this.getAllRoles();
  }

  getAllRoles() {
    this.apiService.getAllRoles().subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.roles = resp;
        }
        else {
          this.roles = [];
        }
      }
      else {
        this.roles = [];
      }
    })
  }

  onClickSubmit(data: any) {
    if (this.formData.valid) {
      this.apiService.addRole(data.role_name).subscribe(resp => {
        if (resp !== null) {
          if (resp.indexOf('Error:') > -1) {
            this.showToast(resp, 'bg-danger');
          }
          else {
            this.resetForm(this.formData);
            this.getAllRoles();
          }
        }
      })
    }
    else {
      this.showToast('Please fill all fields.', 'bg-danger');
    }
  }

  deleteRole(role: any) {
    if (confirm("Are you sure to delete " + role.role_name)) {
      this.apiService.deleteRole(role.id).subscribe(resp => {
        if (resp !== null) {
          if (resp.toLowerCase().indexOf('error') > -1) {
            this.showToast(resp, 'bg-danger');
          }
          else
            this.getAllRoles();
        }
      })
    }
  }

  showToast(msg: any, color: any) {
    document.getElementById('divRoleError')?.classList.add('show')
    document.getElementById('divRoleError')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divRoleError')?.classList.remove('show')
      document.getElementById('divRoleError')?.classList.add(color)
    }, 10000);
  }
}
