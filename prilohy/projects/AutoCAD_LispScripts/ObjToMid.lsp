(defun c:VlozitSRotaci (/ ss zdrojObj zdrojObjVla zdrojStred zdrojUhel i pocet starObj starObjVla starStred starUhel rotace novyObjKopie)
  (vl-load-com)

  ;; --- Funkce pro získání Těžiště (Centroid) ---
  (defun get-exact-center (obj / mSpace curves regionVar regionObj cen pt minpt maxpt)
    (setq mSpace (vla-get-modelspace (vla-get-activedocument (vlax-get-acad-object))))
    (setq pt nil)
    (if (and 
          (not (vl-catch-all-error-p (setq curves (vlax-make-safearray vlax-vbObject '(0 . 0)))))
          (progn (vlax-safearray-put-element curves 0 obj) T)
        )
      (progn
        (if (not (vl-catch-all-error-p (setq regionVar (vl-catch-all-apply 'vla-addregion (list mSpace curves)))))
          (progn
            (setq regionObj (vlax-safearray-get-element (vlax-variant-value regionVar) 0))
            (if (vlax-property-available-p regionObj 'Centroid)
              (setq cen (vlax-get regionObj 'Centroid))
            )
            (vla-delete regionObj)
            (cond
              ((= (type cen) 'VARIANT) (setq pt (vlax-safearray->list (vlax-variant-value cen))))
              ((= (type cen) 'LIST) (setq pt cen))
            )
          )
        )
      )
    )
    (if (not pt)
      (if (not (vl-catch-all-error-p (vl-catch-all-apply 'vla-getboundingbox (list obj 'minpt 'maxpt))))
        (setq pt (mapcar '* (mapcar '+ (vlax-safearray->list minpt) (vlax-safearray->list maxpt)) '(0.5 0.5 0.5)))
      )
      (if (= (length pt) 2) (setq pt (append pt '(0.0))))
    )
    pt
  )

  ;; --- NOVÁ FUNKCE: Získání úhlu k nejvzdálenějšímu bodu (špičce) ---
  (defun get-farthest-point-angle (obj centerPt / maxDist maxPt endParam param currPt currDist)
    (setq maxDist 0.0)
    (setq maxPt nil)
    
    ;; Získáme koncový parametr křivky (počet segmentů)
    (setq endParam (vlax-curve-getEndParam obj))
    (setq param 0)
    
    ;; Projdeme všechny vrcholy křivky (celá čísla parametrů)
    (while (<= param endParam)
      (setq currPt (vlax-curve-getPointAtParam obj param))
      (setq currDist (distance centerPt currPt))
      
      ;; Hledáme maximum
      (if (> currDist maxDist)
        (progn
          (setq maxDist currDist)
          (setq maxPt currPt)
        )
      )
      (setq param (1+ param))
    )
    
    ;; Pokud jsme našli bod, vrátíme úhel od středu k tomuto bodu
    (if maxPt
      (angle centerPt maxPt)
      0.0 ; Fallback
    )
  )

  ;; --- HLAVNÍ KÓD ---
  (prompt "\n--- Vložení s natočením podle špičky ---")

  (setq ss (ssget "_I"))
  (if (not ss) (setq ss (ssget)))

  (if ss
    (progn
      (if (setq zdrojObj (car (entsel "\nKlikněte na VZOROVÝ objekt: ")))
        (progn
          (setq zdrojObjVla (vlax-ename->vla-object zdrojObj))
          
          ;; 1. Střed a Úhel vzoru
          (setq zdrojStred (get-exact-center zdrojObjVla))
          (setq zdrojUhel (get-farthest-point-angle zdrojObjVla zdrojStred))

          (if zdrojStred
            (progn
              (vla-startundomark (vla-get-activedocument (vlax-get-acad-object)))
              
              (setq i 0)
              (setq pocet (sslength ss))
              
              (repeat pocet
                (setq starObj (ssname ss i))
                
                (if (not (equal starObj zdrojObj))
                  (progn
                    (setq starObjVla (vlax-ename->vla-object starObj))
                    
                    ;; 2. Střed a Úhel cíle
                    (setq starStred (get-exact-center starObjVla))
                    (setq starUhel (get-farthest-point-angle starObjVla starStred))

                    (if starStred
                      (progn
                        ;; Kopírování
                        (setq novyObjKopie (vla-copy zdrojObjVla))
                        
                        ;; Přesun na střed
                        (vla-move novyObjKopie (vlax-3d-point zdrojStred) (vlax-3d-point starStred))
                        
                        ;; 3. Výpočet rozdílu rotace (Cíl - Vzor)
                        (setq rotace (- starUhel zdrojUhel))
                        
                        ;; Rotace kolem nového středu
                        (vla-rotate novyObjKopie (vlax-3d-point starStred) rotace)
                      )
                    )
                  )
                )
                (setq i (1+ i))
              )

              (vla-endundomark (vla-get-activedocument (vlax-get-acad-object)))
              (princ (strcat "\nHotovo. Zpracováno: " (itoa pocet)))
              (sssetfirst nil nil) 
            )
            (princ "\nChyba středu.")
          )
        )
        (princ "\nZrušeno.")
      )
    )
    (princ "\nNic nevybráno.")
  )
  (princ)
)