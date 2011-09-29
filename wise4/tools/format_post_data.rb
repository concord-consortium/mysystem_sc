require 'json'

post_data = IO.popen('pbpaste', 'r+').read
parsed = JSON.parse(post_data)

parsed['nodeStates'] = parsed['nodeStates'].map do |nodeState|
  nodeState['response'] = JSON.parse(nodeState['response'])
  nodeState
end

puts JSON.pretty_generate(parsed)