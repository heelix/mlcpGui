MLCP GUI is a user interface to build and execute the command line MarkLogic Content Pump functionality.

To run mlcpuGui, just drop the JAR in the same directory that mlcp.sh or mlcp.bat is in, and run it. 

Usage: java -jar mlcpGui.jar [port]

$ java –jar mlcpGui.jar 8080

And open a browser to http://localhost:8080

The parameter is the port number that will spin up the http server.  The output, as well as the equivalent mlcp parameters that would be sent to the script, will be sent to the console.  You will get a usage message if you run it without a parameter.

Java 8 is required, which is good, because JDK 1.7 is end of life.