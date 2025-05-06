package com.facebookclone.fb_backend.service;

import com.facebookclone.fb_backend.entity.Message;
import com.facebookclone.fb_backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesBetweenUsers(Long userId1, Long userId2) {
        return messageRepository.findBySenderIdAndReceiverId(userId1, userId2);
    }
}