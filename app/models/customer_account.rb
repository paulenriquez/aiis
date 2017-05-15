class CustomerAccount < ApplicationRecord
    has_many :purchase_orders
    has_many :customer_payments

    validate :validate_input

    def cumulative_balance
        result = 0
        PurchaseOrder.where(customer_account_id: self.id).each do |purchase_order|
            result += purchase_order.outstanding_balance
        end
        return result
    end
    def payable_purchase_orders_count
        result = 0
        PurchaseOrder.where(customer_account_id: self.id).each do |purchase_order|
            result += 1 if purchase_order.outstanding_balance > 0
        end
        return result
    end

    private
        def validate_input
            # CUSTOMER NAME
                if self.customer_name.blank?
                    errors.add(:customer_name, 'Customer Name can\'t be blank.')
                end
                if CustomerAccount.exists?(customer_name: self.customer_name)
                    errors.add(:customer_name, 'Customer Name has been taken.')
                end

            # ADDRESS
                if self.address.blank?
                    errors.add(:address, 'Address can\'t be blank.')
                end

            # EMAIL
                if self.email.blank?
                    errors.add(:email, 'Email can\'t be blank.')
                end
                if CustomerAccount.exists?(email: self.email.gsub(' ',''))
                    errors.add(:email, 'Email has been taken.')
                end
        end
end