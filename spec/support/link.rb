module MySystem
  module Views
    class Link < Lebowski::Foundation::Views::View
      representing_sc_class 'LinkIt.Link'
      extend Lebowski::SCUI::Mixins::LinkSupport
    end
  end
end
