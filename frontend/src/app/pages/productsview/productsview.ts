import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../service/product.service';
import { FooterWidget } from '../landing/components/footerwidget';
import { TopbarWidget } from '../landing/components/topbarwidget.component';
import { CartService } from '../service/cart.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-list-demo',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, FooterWidget, TopbarWidget, DialogModule],
    template: `
    <div class="bg-surface-0 dark:bg-surface-900">
        <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" /> 
        <div class="flex flex-col">
            <div class="card">
                <p-dataview [value]="products" [layout]="layout">
                    <ng-template #header>
                        <div class="flex justify-end">
                            <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
                                <ng-template #item let-option>
                                    <i class="pi " [ngClass]="{ 'pi-bars': option === 'list', 'pi-table': option === 'grid' }"></i>
                                </ng-template>
                            </p-select-button>
                        </div>
                    </ng-template>
                    <ng-template #grid let-items>
                        <div class="grid grid-cols-12 gap-4">
                            <div *ngFor="let item of items; let i = index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                    <div class="bg-surface-50 flex justify-center rounded p-6">
                                        <img class="rounded w-full" [src]="item.main_image" [alt]="item.name" style="max-width: 300px" />
                                    </div>
                                    <div class="pt-12">
                                        <div class="flex flex-row justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                                <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-6 mt-6">
                                            <span class="text-2xl font-semibold">$ {{ item.price }}</span>
                                            <div class="flex gap-2">
                                                <p-button icon="pi pi-shopping-cart" (click)="open(item);addToCart(item.id)" label="Buy Now" [disabled]="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap" styleClass="w-full"></p-button>
                                                <p-button icon="pi pi-heart" styleClass="h-full" [outlined]="true"></p-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-dataview>
            </div>
            <footer-widget />
        </div>
        <p-dialog [(visible)]="display" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '30vw' }" [modal]="true">
            <ng-container *ngIf="selectedProduct">
                    <p class="leading-normal m-0">
                        {{ text }}
                    </p>
                <ng-template #footer>
                    <p-button label="Close" (click)="close()" />
                </ng-template>
            </ng-container>
        </p-dialog>
    </div>
    `,
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
    `,
    providers: [ProductService]
})
export class ProductsView {
    layout: 'grid' | 'list' = 'grid';
    options = ['list', 'grid'];
    products: Product[] = [];
    display: boolean = false;
    selectedProduct: Product | null = null;
    errors: boolean = false;
    text: string = 'Succesfully Added';
    constructor(private productService: ProductService, private cartService: CartService) {}

    ngOnInit() {
        this.productService.getProductsSmall().subscribe((products: Product[]) => {
            this.products = products;
        });
    }

    addToCart(productId: number) {
        this.cartService.addToCart(productId).subscribe({
            error: () => this.text="Error"
        });
    }

    open(product: Product) {
        this.selectedProduct = product;
        this.display = true;
    }

    close() {
        this.display = false;
    }
}
