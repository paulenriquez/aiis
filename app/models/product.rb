class Product < ApplicationRecord
    has_many :order_lines
    has_many :purchase_orders, through: :order_lines
    has_many :inventory_histories

    validate :validate_input
    
    before_save :sanitize_input

    def remaining_quantity
        result = 0
        self.inventory_histories.each do |inventory_history|
            if inventory_history.action_type.downcase == 'in'
                result += inventory_history.quantity
            else
                result -= inventory_history.quantity
            end
        end
        return result
    end

    private
        def sanitize_input
            
        end
        def validate_input
             # PRODUCT NAME
                if self.product_name.blank?
                    errors.add(:product_name, 'Product Name can\'t be blank.')
                elsif Product.exists?(product_name: self.product_name)
                    errors.add(:product_name, 'Product Name has been taken.')
                end

            # SPECIFICATIONS
                if self.product_specs.blank?
                    errors.add(:product_specs, 'Specifications can\'t be blank.')
                end

            # CLASSIFICATION
                if self.product_type.blank?
                    errors.add(:product_type, 'Classification can\'t be blank.')
                end

            # UNIT PRICE
                if self.unit_price.blank?
                    errors.add(:unit_price, 'Unit Price can\'t be blank.')
                elsif self.unit_price <= 0
                    errors.add(:unit_price, 'Unit Price must be a positive, non-zero value.')
                end
                
        end
end