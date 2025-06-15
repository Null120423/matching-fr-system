package com.example.order_service.service;

import payment.*;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

import java.time.Instant;

@GrpcService
public class PaymentServiceImpl extends PaymentServiceGrpc.PaymentServiceImplBase {

    @Override
    public void createTransaction(CreateTransactionRequest request, StreamObserver<CreateTransactionResponse> responseObserver) {
        String transactionId = "TXN-" + System.currentTimeMillis();
        CreateTransactionResponse response = CreateTransactionResponse.newBuilder()
                .setTransactionId(transactionId)
                .setStatus("PENDING")
                .setCreatedAt(Instant.now().toString())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void generateQR(GenerateQRRequest request, StreamObserver<GenerateQRResponse> responseObserver) {
         String qrCode = "https://qr.sepay.vn/img?acc=tht12042003&bank=TpBank&amount=100000&des=demo";

        GenerateQRResponse response = GenerateQRResponse.newBuilder()
                .setQrUrl(qrCode)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void handlePaymentCallback(PaymentCallbackRequest request, StreamObserver<PaymentCallbackResponse> responseObserver) {
        System.out.println("Received callback for transaction: " + request.getTransactionId());

        PaymentCallbackResponse response = PaymentCallbackResponse.newBuilder()
                .setSuccess(true)
                .setMessage("Callback processed")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void checkTransactionStatus(CheckTransactionRequest request, StreamObserver<CheckTransactionResponse> responseObserver) {
        CheckTransactionResponse response = CheckTransactionResponse.newBuilder()
                .setTransactionId(request.getTransactionId())
                .setStatus("SUCCESS")
                .setUpdatedAt(Instant.now().toString())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

