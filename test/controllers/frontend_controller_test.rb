require 'test_helper'

class FrontendControllerTest < ActionController::TestCase
  test "should get test" do
    get :test
    assert_response :success
  end

end
