#!C:\Ruby25-x64\bin\ruby.exe
# -*- coding: utf-8 -*-

require "cgi"

cgi = CGI.new()

print "Content-type: text/html\n\n"

if (false)
  print cgi["cmd"]+"<BR/>\n"
  print cgi["data"]+"<BR/>\n"
  print cgi["fn"]+"<BR/>\n"
end

if (cgi['cmd'] == 'erase')
  fh = open('../src/'+cgi['fn'], "w")
  fh.close
elsif (cgi['cmd'] == 'read')
  fh = open('../src/'+cgi['fn'], "r")
  print fh.read
  fh.close
elsif (cgi['cmd'] == 'add')
  fh = open('../src/'+cgi['fn'], "a")
  #fh.printf(cgi['data']+"\n")
  fh.puts cgi['data']
  fh.close
else
  fh = open('../src/'+cgi['fn'], "r")
  olddata = fh.read#readによって持ってきたデータはテキストデータとして扱われる
  newdata = olddata.gsub(/#{cgi['data']}\n/, '')#指定した文字列を置換する
  fh = open('../src/'+cgi['fn'], "w")
  fh.print newdata
  fh.close
end
