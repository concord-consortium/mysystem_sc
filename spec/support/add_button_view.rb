module MySystem
  module Views
    class PaletteItemView < Lebowski::Foundation::Views::View
      representing_sc_class 'MySystem.PaletteItemView'

      def drag_in_canvas(x, y)
        self.drag_to(@parent, x, y)
      end

    end
  end
end
