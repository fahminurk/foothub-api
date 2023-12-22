import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubcategoryDto } from './subcategory.dto';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  findAll() {
    return this.subCategoryService.getAllSubcategories();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.subCategoryService.getSubcategoryById(id);
  }

  @Post()
  create(@Body() data: CreateSubcategoryDto) {
    return this.subCategoryService.createSubategory(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.subCategoryService.deleteSubategory(id);
  }
}
