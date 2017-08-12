import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, AlertController, ToastController, NavController } from "ionic-angular";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { RecipesService } from "../../services/recipes";
import { Recipe } from "../../models/recipe";

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements  OnInit{

  mode = 'New';
  selectOptions = ['參數1', '參數2', '參數3'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipesService: RecipesService,
              private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    // This link of code should be at the bottom
    this.initializeForm();

  }

  onSubmit() {
    const fValue =this.recipeForm.value;
    let ingredients = [];
    if (fValue.ingredients.length > 0 ) {
      ingredients = fValue.ingredients.map(name => {
        return {name: name, amount: 1};
      })
    }
    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index,
        fValue.title,
        fValue.description,
        fValue.difficulty,
        ingredients)
    } else {
      this.recipesService.addRecipe(
        fValue.title,
        fValue.description,
        fValue.difficulty,
        ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'what do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if (len > 0 ) {
              for (let i = len - 1; i >= 0; i--) {
                fArray.removeAt(i);
                this.toast('All ingredients have been removed!')
              }
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this. recipe.difficulty;
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [{
          name: 'name',
          placeholder: 'Name'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name.trim() == '' || data.name == null ) {
              this.toast('Please enter a valid value!')
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name,Validators.required))
          }
        }
      ]
    });
  }

  private toast(msg: string) {
    const toastCtrl = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
    });
    toastCtrl.present();
  }
}
