import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubcategoryDto } from './subcategory.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  findAll() {
    return this.subCategoryService.getAllSubcategories();
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.subCategoryService.getSubcategoryByCategory(id);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.subCategoryService.getSubcategoryById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  create(@Body() data: CreateSubcategoryDto) {
    return this.subCategoryService.createSubategory(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  delete(@Param('id') id: number) {
    return this.subCategoryService.deleteSubategory(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  update(@Param('id') id: number, @Body() data: CreateSubcategoryDto) {
    return this.subCategoryService.updateSubategory(id, data);
  }
}
