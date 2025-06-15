package com.example.order_service.service;
import hello.HelloRequest;
import hello.HelloReply;
import hello.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase {

    @Override
    public void sayHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        String name = request.getName();
        HelloReply reply = HelloReply.newBuilder()
                .setMessage("Hello from Java Spring Boot, " + name)
                .build();

        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }
}
