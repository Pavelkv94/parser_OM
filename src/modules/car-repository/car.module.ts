import { Module } from '@nestjs/common';
import { CarService } from './car.service';

@Module({
  providers: [CarService],
  exports: [CarService]
})
export class CarModule { }
