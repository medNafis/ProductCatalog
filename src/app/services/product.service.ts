import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { pageProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Array<Product>;
  constructor() {
    this.products = [
      {id:UUID.UUID(), name: "Computer", price: 6500, promotion:true},
      {id:UUID.UUID(), name: "Printer", price: 4000, promotion:false},
      {id:UUID.UUID(), name: "Phone", price: 1400, promotion:true},
      {id:UUID.UUID(), name: "Another Phone", price: 1500, promotion:true},
    ];

    for (let i=0; i<10; i++){
      this.products.push({id:UUID.UUID(), name: "Computer", price: 6500, promotion:true});
      this.products.push({id:UUID.UUID(), name: "Printer", price: 4000, promotion:false});
      this.products.push({id:UUID.UUID(), name: "Phone", price: 1400, promotion:true});
      this.products.push({id:UUID.UUID(), name: "Another Phone", price: 1500, promotion:true});
    }
    
   }

   public getAllProducts() : Observable<Product[]>{
    let rnd= Math.random();
    if (rnd<0.1) return throwError(()=> new Error("Internet Connexion Error"));
    else return of(this.products);
   }

   public deleteProduct(id: string) : Observable<boolean>{
    this.products = this.products.filter(p=>p.id!=id);
    return of(true);
   }

   public setPromotion(id:string) : Observable<boolean>{
    let product = this.products.find(p=>p.id==id);
    if(product != undefined){
    product.promotion = !product.promotion;
    return of(true);
    }
    else return throwError(()=> new Error ("Product not found"));
   }

   public searchProducts(keyword : string, page: number, size: number) : Observable<pageProduct>{
      let result = this.products.filter(p=>p.name.includes(keyword));
      let index = page * size;
      let totalPages = ~~(result.length/size);
      if(this.products.length%size!=0)
        totalPages++;
      let pageProducts = result.slice(index, index+size);
      return of({products : pageProducts, page: page, size: size, totalPages: totalPages });
   }

   public getPageProducts(page: number, size: number) : Observable<pageProduct>{
    let index = page * size;
    let totalPages = ~~(this.products.length/size);
    if(this.products.length%size!=0)
      totalPages++;
    let pageProducts = this.products.slice(index, index+size);
    return of( {products : pageProducts, page: page, size: size, totalPages: totalPages });
   }

   public addNewProduct(product: Product) : Observable<Product> {
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
   }

   public getProduct(id: string) : Observable<Product>{
    let product = this.products.find(p=>p.id=id);
    if(product == undefined) return throwError ( ()=> new Error('Product not found'));
    else return of(product);
   }

   getNameErrorMessage( name: any, errors : any){
    if(errors['required']){
      return "Name is required";
    } else if (errors['minlength']){
      return "Name should have at least 4 characters";
    } return "";
  }
  getPriceErrorMessage( price: any, errors : any){
    if(errors['required']){
      return "Price is required";
    } else return "";
  }

  public updateProduct ( product : Product) : Observable<Product>{
    this.products = this.products.map(p=> (p.id==product.id)?product:p);
    return of(product);
  }

}
