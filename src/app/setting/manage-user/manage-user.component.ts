import { Component, OnInit } from '@angular/core';
import { BiblApiService } from '../../_service/bibl-api.service';
import {AuthService } from '../../_service/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit{
  user: any = null;
  users: any = [];
  roles: any = [];
  errorMessage = '';
  formUserData: FormGroup;

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
  ){
    this.formUserData = new FormGroup({
      userName: new FormControl('',  [
                              Validators.required,
                              Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
                            ]),
      role: new FormControl(null,  Validators.required ),
    });
  }

  resetForm(form: FormGroup) {
		form.reset();
	}

  ngOnInit(): void {
    this.getAllUsers();
    ////////////////
    this.getAllRoles();
  }

  getAllUsers(){
    this.apiService.getAllUsers().subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.users = resp;
        }
        else{
          this.users = [];
        }
      }else{
        this.users = [];
      }
    })
  }

  getAllRoles(){
    this.apiService.getAllRoles().subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.roles = resp;
        }
      }
    })
  }

  onClickSubmit(data: any) {
    if (this.formUserData.valid) {
      this.apiService.addUser(data.userName, data.role.id).subscribe(resp => {
        if (resp !== null) {
          if(resp.indexOf('Error:') > -1)
          {
            this.showToast(resp, 'bg-danger');
          }
          else
          {
            this.showToast(`Password has been sent to ${data.userName}. Please check email.`, 'bg-success');
            this.resetForm(this.formUserData);
            this.getAllUsers();
          }
        }
      })
    }
    else
    {
      this.showToast('Please fill all fields.', 'bg-danger');
    }
  }

  deleteUser(user: any)
  {
    if(confirm("Are you sure to delete " + user.username)) {
      this.apiService.deleteUser(user.id).subscribe(resp => {
        if (resp !== null) {
          this.getAllUsers();
        }
      })
    }
  }

  showToast(msg:any, color:any) {
    document.getElementById('divError')?.classList.add('show')
    document.getElementById('divError')?.classList.add(color)
    this.errorMessage = msg;
    setTimeout(() => {
      document.getElementById('divError')?.classList.remove('show')
      document.getElementById('divError')?.classList.remove(color)
    }, 10000);
  }
}
