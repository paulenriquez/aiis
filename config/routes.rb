Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :customer_accounts
  resources :customer_payments
  resources :purchase_orders
  resources :products
  resources :order_lines
  resources :inventory_histories
end
