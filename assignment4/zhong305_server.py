#!/usr/bin/env python3
# See https://docs.python.org/3.2/library/socket.html
# for a description of python socket and its parameters
import socket
import string
import os.path
import stat
import os

from threading import Thread
from argparse import ArgumentParser

BUFSIZE = 4096

def client_talk(client_sock, client_addr):
    print('talking to {}'.format(client_addr))
    byteData = client_sock.recv(BUFSIZE)
    while byteData:
      data = byteData.decode('utf-8')
      print('the whole request is \r\n{}\r\n' .format(data))
      dataLined = data.splitlines()
      #print('the first line is [{}]' .format(dataLined[0]))
      request = dataLined[0].split()
      if len(request) == 3:
          if request[0] == "GET":
              sendmsg = requestGet(request)
          elif request[0] == "HEAD":
              sendmsg = requestHead(request)
          elif request[0] == "POST":
              sendmsg = requestPost(request[2],dataLined[len(dataLined)-1])
          else:
              sendmsg = ''.join([request[2]," 405 METHOD NOT ALLOWED\r\n\r\nAllow: GET, HEAD\r\n\r\n"])
      else:
          sendmsg = ''.join(["HTTP/1.1"," 400 BAD REQUEST\r\n\r\n<html><head><title>400 BAD REQUEST</title></head>\
            <body><center><h1>400 BAD REQUEST</h1></br></center></body></html>"])
      print('Response:\n {}' .format(sendmsg))
      client_sock.send(bytes(sendmsg, 'utf-8'))
      byteData = client_sock.recv(BUFSIZE)

    # clean up
    client_sock.shutdown(1)
    client_sock.close()
    print('connection closed.')

def requestGet(request):
    #check for 404 error: file existance
    filename = request[1].split("/")
    if(filename[len(filename)-1] == "csumn"):
        msg = ''.join([request[2]," 301 MOVED PERMANENTLY\r\nLocation:  https://www.cs.umn.edu/\r\n\r\n"])
    elif not(os.path.exists(request[1])):
        f = open('404.html','r')
        fstr = f.read()
        f.close()
        msg = ''.join([request[2]," 404 NOT FOUND","\r\n\r\n",fstr])
    #check for 403 error: check permission
    elif not bool(os.stat(request[1]).st_mode & stat.S_IROTH):
        f = open('403.html','r')
        fstr = f.read()
        f.close()
        msg = ''.join([request[2]," 403 FORBIDDEN","\r\n\r\n",fstr])
    elif not (request[1].split(".")[1] == "html"):
        msg = ''.join([request[2]," 406 NOT ACCEPTABLE\r\n\r\n<html><head><title>406 NOT ACCEPTABLE</title></head>\
          <body><center><h1>406 NOT ACCEPTABLE</h1></br></center></body></html>"])
    else:
        f = open(request[1],'r')
        fstr = f.read()
        f.close()
        msg = ''.join([request[2]," 200 OK","\r\n\r\n\r\n",fstr])
    return msg

def requestHead(request):
    #check for redirectoin
    filename = request[1].split("/")
    if(filename[len(filename)-1] == "csumn"):
        msg = ''.join([request[2]," 301 MOVED PERMANENTLY\r\n\r\n"])
    #check for 404 error: file existance
    elif not(os.path.exists(request[1])):
        msg = ''.join([request[2]," 404 NOT FOUND\r\n\r\n"])
    #check for 403 error: check permission
    elif not bool(os.stat(request[1]).st_mode & stat.S_IROTH):
        msg = ''.join([request[2]," 403 FORBIDDEN\r\n\r\n"])
    elif not (request[1].split(".")[1] == "html"):
        msg = ''.join([request[2]," 406 NOT ACCEPTABLE\r\n\r\n"])
    else:
        msg = ''.join([request[2]," 200 OK\r\n\r\n\r\n"])
    return msg

def requestPost(protocal,request):
    #The request here is not the first line of the whole request as in head and get function, it is the body of the request which contains the submit information.
    postSplit = request.split("=")
    eventNameSplit = postSplit[1].split("&")
    eventName = eventNameSplit[0].replace("+"," ")
    startTimeSplit = postSplit[2].split("&")
    startTime = ''.join([startTimeSplit[0].split("%")[0],":",startTimeSplit[0].split("A")[1]])
    endTimeSplit = postSplit[3].split("&")
    endTime = ''.join([endTimeSplit[0].split("%")[0],":",endTimeSplit[0].split("A")[1]])
    locationSplit = postSplit[4].split("&")
    location = locationSplit[0].replace("+"," ")
    day = postSplit[5]
    #print('Posted information: event:{}\nstart:{}\nend:{}\nlocation:{}\nday:{}\n' .format(eventName,startTime,endTime,location,day))
    submitTable = ''.join(["<html><head><title> Submit information</title><meta charset=\"utf-8\"><style>table, tr, td{\
          border: 1px solid black;border-collapse: collapse;width: 400px;}tr:nth-child(odd){background-color: #ffffff}\
          tr:nth-child(even){background-color: #d7d7d7}</style></head><body>\
        <h2>Following Form Data Submitted Successfully: </h2><table><tr><td>Event name</td>\
            <td>",eventName,"</td></tr><tr><td>Start Time</td><td>",startTime,"</td></tr><tr><td>End Time</td>\
            <td>",endTime,"</td></tr><tr><td>Location</td><td>",location,"</td></tr><tr>\
            <td>Day</td><td>",day,"</td></tr></table></body></html>"])
    msg = ''.join([protocal," 200 OK\r\n\r\n",submitTable])
    return msg

class EchoServer:
  def __init__(self, host, port):
    print('listening on port {}'.format(port))
    self.host = host
    self.port = port

    self.setup_socket()

    self.accept()

    self.sock.shutdown()
    self.sock.close()

  def setup_socket(self):
    self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.sock.bind((self.host, self.port))
    self.sock.listen(128)

  def accept(self):
    while True:
      (client, address) = self.sock.accept()
      print(self)
      th = Thread(target=client_talk, args=(client, address))
      th.start()


def parse_args():
  parser = ArgumentParser()
  parser.add_argument('--host', type=str, default='localhost',
                      help='specify a host to operate on (default: localhost)')
  parser.add_argument('-p', '--port', type=int, default=9001,
                      help='specify a port to operate on (default: 9001)')
  args = parser.parse_args()
  return (args.host, args.port)


if __name__ == '__main__':
  (host, port) = parse_args()
  EchoServer(host, port)
