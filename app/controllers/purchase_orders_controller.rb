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
            create_inventory_histories(@purchase_order)
            redirect_to(purchase_order_path(@purchase_order))
        else

        end
    end
    def show
        @purchase_order = PurchaseOrder.find(params[:id])
    end
    def edit
        @purchase_order = PurchaseOrder.find(params[:id])
        @customer_accounts = CustomerAccount.all
        @products = Product.all
    end
    def update
        
    end

    private
        def purchase_order_params
            params.require(:purchase_order).permit!
        end
        def create_inventory_histories(purchase_order)
            purchase_order.order_lines.each do |order_line|
                inventory_history = InventoryHistory.new(
                    date_changed: purchase_order.purchase_date,
                    action_type: 'out',
                    quantity: order_line.quantity,
                    remarks: 'Generated with ' + purchase_order.po_num,
                    product_id: order_line.product_id
                )
                inventory_history.save
            end
        end
end