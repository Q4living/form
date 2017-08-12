import { Ingredient } from "../models/ingredient";

export class ShoppingListService {
  private ingredents: Ingredient[] = [];

  addItem(name: string, param1: number, param2: string) {
    this.ingredents.push(new Ingredient(name, param1, param2));
    console.log(this.ingredents);
  }

  addItems(items: Ingredient[]) {
    this.ingredents.push(...items);
  }

  getItems() {
    return this.ingredents.slice();
  }

  removeItem(index: number) {
    this.ingredents.splice(index, 1);
  }

}
