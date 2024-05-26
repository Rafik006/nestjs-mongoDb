import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People } from '@mui/icons-material';
@Injectable()
export class ProductsService {
  private products: Product[] = [];
  constructor(
    @InjectModel('Products') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const result = await newProduct.save();

    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    })) as Product[];
  }

  async getSingleProduct(productId: string)  {
    const product = await this.findProduct(productId);
    return {
      id:product.id,
      title:product.title,
      description:product.description,
      price:product.price
    };
  }

    async updateProduct(
      productId: string,
      title: string,
      desc: string,
      price: number,
    ) {
      const updateProduct=await this.findProduct(productId)
      if(title){
        updateProduct.title=title
      }
      if(desc){
        updateProduct.description=desc
      }
      if(price){
        updateProduct.price=price
      }
      return await updateProduct.save()
    }

  async deleteProduct(prodId: string) {
    return await this.productModel.findByIdAndDelete(prodId, { new: true });
  }

  private async findProduct(id: string) :Promise <Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product');
    }
    if (!product) {
      throw new NotFoundException('Could not find product');
    }
    return product
  }
}
