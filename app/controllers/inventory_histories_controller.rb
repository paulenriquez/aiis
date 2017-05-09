class InventoryHistoriesController < ApplicationController
    before_action :get_records, only: [:index, :new, :edit]

    def index

    end
    def new
        @inventory_history = InventoryHistory.new
    end
    def create

    end
    def edit

    end
    def update

    end
    
    private
        def inventory_history_params

        end
        def get_records
            @products = Product.all
        end
end
