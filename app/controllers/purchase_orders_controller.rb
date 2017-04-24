class PurchaseOrdersController < ApplicationController
    def index

    end
    def new
        @purchase_order = PurchaseOrder.new
    end
    def create
        @purchase_order = PurchaseOrder.new(purchase_order_params)
        
    end
    def show

    end

    private
        def purchase_order_params
            params.require(:purchase_order).permit(
                :purchase_date,
                :discount,
                :negotiated_price,
                :payment_terms,
                :due_date,
                :customer_account_id
            )
        end
end