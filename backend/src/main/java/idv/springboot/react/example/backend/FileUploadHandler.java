// A simple REST controller written in a Spring-boot application to handle recording file uploading.


package idv.springboot.react.example.backend;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;


@RestController
public class FileUploadHandler {


    @PostMapping(path="/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseBody
    public String uploadFile(@RequestParam MultipartFile file) {

        int file_size = (int) file.getSize(); //unit in bytes
        
        return Integer.toString(file_size); //ResponseEntity.ok().body("test1234");
        
    }  
}