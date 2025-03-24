from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    stock = models.IntegerField(default=0, null=True)
    main_image = models.ImageField(upload_to='products', default='products/default.jpg', max_length=255)
    category = models.CharField(max_length=100, null=True)


    def __str__(self):
        return self.name
    
    def get_stock_status(self):
        if self.stock <= 0:
            return 'OUT OF STOCK'
        elif self.stock < 10:
            return 'LOW OF STOCK'
        else:
            return 'IN STOCK' 
    