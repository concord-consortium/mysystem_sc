module MySystem
  module Views
    class AddButtonView < Lebowski::Foundation::Views::View
      representing_sc_class 'MySystem.AddButtonView'

      def drag_in_canvas(x, y)
        self.drag_to(@parent, x, y)
      end

    end
  end
end
