class InventoryHistoriesController < ApplicationController
    before_action :get_records, only: [:index, :new, :edit]

    def index

    end
    def new
        if params[:product] != nil && params[:product] != '' && Product.exists?(params[:product])
            @inventory_history = InventoryHistory.new(product_id: params[:product])
        else
            @inventory_history = InventoryHistory.new
        end
    end
    def create
        @inventory_history = InventoryHistory.new(inventory_history_params)
        if @inventory_history.save
            redirect_to(inventory_histories_path(@inventory_history))
        else
            render :new
        end
    end
    def show
        @inventory_history = InventoryHistory.find(params[:id])
    end
    def edit

    end
    def update

    end
    
    private
        def inventory_history_params
            params.require(:inventory_history).permit!
        end
        def get_records
            @products = Product.all
        end
end
