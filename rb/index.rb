#!C:\Ruby25-x64\bin\ruby.exe
# -*- coding: utf-8 -*-

require "cgi"
require "json"

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
elsif (cgi['cmd'] == 'transAll')
  readfh = open('../src/list/readArticleList.txt', "r")
  noreadfh = open('../src/list/noreadArticleList.txt', "a")
  data = readfh.read
  noreadfh.puts data
  print data

  readfh = open('../src/list/readArticleList.txt', "w")#リストをすべて消す
  readfh.close
  noreadfh.close
elsif (cgi['cmd'] == 'add')
  fh = open('../src/'+cgi['fn'], "a")
  #fh.printf(cgi['data']+"\n")
  fh.puts cgi['data']
  fh.close
elsif (cgi['cmd'] == 'readArray')
  articleArray = cgi['fn'].split(",")
  data = {}
  i = 0
  for id in articleArray do
    file_name = '../src/article/' + id + '.txt'
    fh = open(file_name, "r")#ここと38行でエラーが発生している。原因は読み込んだデータがJSONにする際にUTF-8以外の文字列を含んでいるから上手くエンコードされない
    data.store(i, fh.read.force_encoding("UTF-8"))
    i = i+1
    fh.close
  end
  print data.to_json
else
  fh = open('../src/'+cgi['fn'], "r")
  olddata = fh.read#readによって持ってきたデータはテキストデータとして扱われる
  newdata = olddata.gsub(/#{cgi['data']}\n/, '')#指定した文字列を置換する
  fh = open('../src/'+cgi['fn'], "w")
  fh.print newdata
  fh.close
end
