class PurchaseOrdersController < ApplicationController
    before_action :get_records, only: [:index, :new, :edit]

    def index
    end
    def new
        @purchase_order = PurchaseOrder.new
    end
    def create
        @purchase_order = PurchaseOrder.new(purchase_order_params)
        if @purchase_order.save
            create_inventory_histories(@purchase_order)
            redirect_to(purchase_order_path(@purchase_order))
        else
            render :new
        end
    end
    def show
        @purchase_order = PurchaseOrder.find(params[:id])
    end
    def edit
        @purchase_order = PurchaseOrder.find(params[:id])
    end
    def edit_status
        @purchase_order = PurchaseOrder.find(params[:purchase_order_id])
    end
    def update
        @purchase_order = PurchaseOrder.find(params[:id])
        if @purchase_order.update(purchase_order_params)
            redirect_to(purchase_order_path(@purchase_order))
        else
            render :edit
        end
    end

    private
        def get_records
            @purchase_orders = PurchaseOrder.all
            @customer_accounts = CustomerAccount.all
            @products = Product.all
        end
        def purchase_order_params
            params.require(:purchase_order).permit!
        end
        def create_inventory_histories(purchase_order)
            purchase_order.order_lines.each do |order_line|
                inventory_history = InventoryHistory.new(
                    date_changed: purchase_order.purchase_date,
                    action_type: 'out',
                    quantity: order_line.quantity,
                    product_id: order_line.product_id,
                    order_line_id: order_line.id
                )
                inventory_history.save
            end
        end

        # Create Customer Payment if fully paid.
        def create_customer_payment(purchase_order)

        end
end