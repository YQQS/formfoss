package se.sjtu.formfoss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormRepository;

import java.util.List;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;

    public List<FormEntity> getPublished() {
        return formRepository.findByIsPublishedIsTrue();
    }

    public FormEntity getFormById(int id) {
        return formRepository.findOne(id);
    }
}
