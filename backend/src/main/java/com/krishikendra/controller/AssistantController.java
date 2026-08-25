package com.krishikendra.controller;

import com.krishikendra.dto.request.AssistantChatRequest;
import com.krishikendra.dto.response.AssistantChatResponse;
import com.krishikendra.service.AssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AssistantChatResponse> chat(@Valid @RequestBody AssistantChatRequest request) {
        AssistantChatResponse response = assistantService.processQuestion(request);
        return ResponseEntity.ok(response);
    }
}
