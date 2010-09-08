# ==========================================================================
# Project:   Lebowski Framework - The SproutCore Test Automation Framework
# License:   Licensed under MIT license (see License.txt)
# ==========================================================================

module Lebowski
  module SCUI
    module Mixins
      
      module LinkSupport
        
        def start_node
          return self['startNode']
        end
        
        def end_node
          return self['endNode']
        end
        
        def start_terminal
          return self['startTerminal']
        end
        
        def end_terminal
          return self['endTerminal']
        end
        
        def start_control_point
          return { :x => self['_startControlPt'].x, :y => self['_startControlPt'].y }
        end
        
        def end_control_point
          return { :x => self['_endControlPt'].x, :y => self['_endControlPt'].y }
        end
        
      end
   
    end
  end
end