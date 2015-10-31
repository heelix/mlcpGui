package com.marklogic;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class EmbeddingJettyMLCPWithServlet {
	
	public static void main(String[] args) throws Exception {
		
		int port = 8080; // not sure if I'm going do default or not.
		
    	switch(args.length){
			case 1:{
				port = Integer.parseInt(args[0]); //FIXME - could be bad cast
				
	            System.out.print("\n +-----------------------------------------------------------------");
	            System.out.print("\n | MLCP GUI.  Version 1.0.0");
	            System.out.print("\n | ");
	            System.out.print("\n | Creeates a local HTTP server to generate MPCP requests");
	            System.out.print("\n +-----------------------------------------------------------------");
				System.out.print("\n | ");
				System.out.print("\n | * Browse to http://localhost:" + port);
				System.out.print("\n +-----------------------------------------------------------------\n");
				
				Server server = new Server(port);
				ServletContextHandler ctx = new ServletContextHandler();
				ctx.setContextPath("/");
				DefaultServlet defaultServlet = new DefaultServlet();
				ServletHolder holderPwd = new ServletHolder("default", defaultServlet);
				holderPwd.setInitParameter("resourceBase", "./src/webapp/");
				ctx.addServlet(holderPwd, "/*");
				ctx.addServlet(MLCPServlet.class, "/mlcp");
				server.setHandler(ctx);
				server.start();
				break;
			}
			
			default:{
				System.out.println("\nMLCP GUI. Creeates a local HTTP server to generate MPCP requests.\n");
				System.out.println("Usage: java -jar mlcpGui.jar [port]");
				System.out.println("\t port the HTTP server will be listening on.");
				System.out.println("\nExample: java -jar  mlcpGui.jar 8080");
			}
    	}
	}
	
	public static class MLCPServlet extends HttpServlet {
		
		private static final long serialVersionUID = 42L;

		public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
			handleRequest(req, res);
		}
	
		public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
			handleRequest(req, res);
		}
		
		public void handleRequest(HttpServletRequest req, HttpServletResponse res) throws IOException {
	
			PrintWriter out = res.getWriter();
			res.setContentType("text/html");
			out.write("<h3>DEBUG</h3>");
			
			Enumeration<String> parameterNames = req.getParameterNames();
			Map<String, String> params = new HashMap<String, String>();
	
			while (parameterNames.hasMoreElements()) {
				String paramName = parameterNames.nextElement();
				String paramValue = req.getParameter(paramName);
				params.put(paramName, paramValue);
				out.write("<li>"+paramName +":"+ paramValue+"</li>");
				System.out.println("* "+paramName +":"+ paramValue);
			}
//			MlcpRunner runner = new MlcpRunner(params);
			out.close();
		}
	}
}