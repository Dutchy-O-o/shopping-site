using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using ShoppingSiteAPI.DTOs;
using System.Numerics;

namespace ShoppingSiteAPI.Database
{
    public class AppDbContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public AppDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(Configuration.GetConnectionString("WebAPIDatabase"));

        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderedItem> OrderedItems { get; set; }
        public DbSet<MutedCustomer> MutedCustomers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
        public DbSet<CustomerDto> CustomerDtos { get; set; }
        public DbSet<ProductDto> ProductDtos { get; set; }
        public DbSet<ShoppingCartDto> ShoppingCartDtos { get; set; }
        public DbSet<ProductsJoinCategoriesDto> ProductsJoinCategoriesDtos { get; set; }
        public DbSet<ShoppingCartItemsJoinShoppingCartsJoinProductsDto> ShoppingCartItemsJoinShoppingCartsJoinProductsDTOs { get; set; }
        public DbSet<ReviewsJoinCustomersDto> ReviewsJoinCustomersDtos { get; set; }
        public DbSet<ShoppingCartItemDto> ShoppingCartItemDtos { get; set; }
        public DbSet<OrdersJoinOrderedItemsJoinProductsDto> OrdersJoinOrderedItemsJoinProductsDtos { get; set; }
        public DbSet<MutedCustomersJoinCustomersDTO> MutedCustomersJoinCustomersDtos { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)      //define foreign keys and cascade delete behaviour, entity framework why no update behaviour :(
        {
            modelBuilder.Entity<Address>()          //Address
                .HasOne<Customer>()
                .WithMany()
                .HasForeignKey(p => p.CustomerId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<MutedCustomer>()          //MutedCustomer 1
                .HasOne<Customer>()
                .WithMany()
                .HasForeignKey(p => p.CustomerId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<Review>()          //Review 1
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(p => p.ProductId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<Review>()          //Review 2
                .HasOne<Customer>()
                .WithMany()
                .HasForeignKey(p => p.CustomerId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<ShoppingCartItem>()          //ShoppingCartItem 1
                .HasOne<ShoppingCart>()
                .WithMany()
                .HasForeignKey(p => p.ShoppingCartId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<ShoppingCartItem>()          //ShoppingCartItem 2
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(p => p.ProductId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<ShoppingCart>()          //ShoppingCart
                .HasOne<Customer>()
                .WithMany()
                .HasForeignKey(p => p.CustomerId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<OrderedItem>()
                .HasKey(o => new { o.ProductId, o.OrderId });

            modelBuilder.Entity<OrderedItem>()          //ShoppingCart
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(p => p.OrderId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<OrderedItem>()          //ShoppingCart
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(p => p.ProductId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<Order>()          //ShoppingCart
                .HasOne<Customer>()
                .WithMany()
                .HasForeignKey(p => p.CustomerId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete
            /*
            modelBuilder.Entity<Category>()          //Category
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.ParentCategoryId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete
            */
            modelBuilder.Entity<Product>()          //Product 2
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId)    //foreign key
                .OnDelete(DeleteBehavior.Cascade);      //cascade delete

            modelBuilder.Entity<CustomerDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ProductDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ShoppingCartDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ProductsJoinCategoriesDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ShoppingCartItemsJoinShoppingCartsJoinProductsDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ReviewsJoinCustomersDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<ShoppingCartItemDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<OrdersJoinOrderedItemsJoinProductsDto>().HasNoKey();  //the dto used to get the function has no key
            modelBuilder.Entity<MutedCustomersJoinCustomersDTO>().HasNoKey();  //the dto used to get the function has no key
        }
    }
}