import { Component, Injectable } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list";
import { Ingredient } from "../../models/ingredient";
import { Storage } from '@ionic/storage';
import { Http, Headers } from "@angular/http";
import { NavParams } from "ionic-angular";


@Injectable()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];
  index: any;

  constructor(private slService: ShoppingListService,
              // private storage: Storage,
              private  http: Http
  ){};

  ionViewWillEnter() {
    this.loadItems();

    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    // For backup as form urlencoded
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var msg = {firstName: '裸品流程卡' };

    let body = JSON.stringify(msg);

    this.http.post('http://192.168.31.150:3000/users/names', body, { headers: headers })
      .subscribe(data => {
        console.log(data);
        this.index = data.text();
      });


  }

  onAddItem(form: NgForm){
    this.slService.addItem(form.value.ingredientName, form.value.param1, form.value.param2);
    // this.storage.set('order', form.value);


    var headers = new Headers();
    headers.append( 'Content-Type', 'application/json' );
    // For backup as form urlencoded
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let body = JSON.stringify(form.value);

    // console.log(body);

    this.http.post('http://192.168.31.150:3000/users', body, { headers: headers })
      .subscribe(data => console.log(data));

    form.reset();
    this.loadItems();

    // this.storage.get('name').then((val) => {
    //   console.log('Your name', val.ingredientName);
    //
    // });
  }

  onCheckItem(index: number) {
    this.slService.removeItem(index);
    this.loadItems();
  }

  private loadItems() {
    this.listItems = this.slService.getItems();
  }


}
