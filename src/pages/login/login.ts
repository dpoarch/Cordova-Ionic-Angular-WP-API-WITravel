import { Component } from '@angular/core';
import { RegisterPage } from '../register/register'
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/users';
import { AngularFireAuth} from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_form: FormGroup;
  error_message: string;
  pet: string = "cola";
  tab:any;
  user = {} as User;
  register_form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService, private afAuth: AngularFireAuth,
    public alertCtrl: AlertController
  ) {this.tab = this.navCtrl.parent;}

  ionViewWillLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });

    loading.dismiss();
  }
  onSubmit(values){
    var username: 'aa';
    var password: 'aa';
    this.authenticationService.doLogin(username, password)
    .subscribe(
      res => {
        let user_data = {
          username: values.username,
          name: values.displayName,
          email: values.email,
          password: values.password
        };
        this.authenticationService.doRegister(user_data, res.json().token)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      },
      err => {
        console.log(err);
      }
    )
  }
async register(user: User){
  try{
    const result = this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    if(result){
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: 'Your Account Has Been Registered !',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  catch (e){
    console.error(e);
  }
}
async logged(user:User){
try{
  const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  if(result){
    this.navCtrl.setRoot(TabsPage);
  }
}
catch(e){
  let alert = this.alertCtrl.create({
    title: 'Please try Again!',
    message: (e),
    buttons: ['OK']
  });
  alert.present();

}
  
}

  skip(){
    this.navCtrl.setRoot(TabsPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

}
