class ProductsController < ApplicationController
    def index
        @products = Product.all
    end
    def new
        @product = Product.new
    end
    def create
        @product = Product.new(product_params)
        if @product.save
            redirect_to(products_path(@product))
        else
            render :new
        end
    end
    def show
        @product = Product.find(params[:id])
    end
    def edit
        @product = Product.find(params[:id])
    end
    def update

    end

    private
        def product_params
            params.require(:product).permit!
        end
end
