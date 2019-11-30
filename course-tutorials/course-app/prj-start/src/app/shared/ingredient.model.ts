export class Ingredient {
  // public name: string;
  // constructor(name: string) {
  //   this.name = name;
  // }

  // instead of the above, we can shorten our model down to the following:
  // remember to include access modifier
  // ctor alias names are also names of model props
  constructor(public name: string, public amount: number) {}
}