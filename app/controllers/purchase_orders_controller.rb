class PurchaseOrdersController < ApplicationController
    def index

    end
    def new
        @purchase_order = PurchaseOrder.new
        @customer_accounts = CustomerAccount.all
        @products = Product.all
    end
    def create
        @purchase_order = PurchaseOrder.new(purchase_order_params)
        if @purchase_order.save
            
        else

        end
    end
    def show

    end
    def edit

    end
    def update
        
    end

    private
        def purchase_order_params
            params.require(:purchase_order).permit!
        end
end