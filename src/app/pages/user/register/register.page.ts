import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from 'app/services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  private registerForm: FormGroup

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  public ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      repassword: new FormControl('', Validators.required)
    })
  }

  private onSubmit() {
    this.userService.getUserList().subscribe()
  }
}
