import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder,
     private authService: AuthService,
     private router: Router) {
    this.form = this.fb.group({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8)]),
      'role': new FormControl(['user'])
    });
   }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.getRawValue()).subscribe(
        _ => {
          this.router.navigate(['login']);
        },
        (error: Error) => {
          console.error(error);
        }
      );
    }
  }

}
